package com.sap.pia.producer;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import javax.naming.NamingException;
import org.odata4j.core.ODataConstants;
import org.odata4j.edm.EdmDataServices;
import org.odata4j.edm.EdmEntityContainer;
import org.odata4j.edm.EdmEntitySet;
import org.odata4j.edm.EdmEntityType;
import org.odata4j.edm.EdmProperty;
import org.odata4j.edm.EdmSchema;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class GetMetaData
{

	/**
	 * Member variables which will be read from properties files
	 */
	private Map<String, String> propertiesMap;

	/**
	 * Static constant Logger object used for adding various logs .
	 */
	private static final Logger LOGGER= LoggerFactory.getLogger(GetMetaData.class);

	private String dataBase;
	private EdmDataServices metadata;
	/** jdbc connection */
	private Connection connection;
	/** jdbc operation assistant */
	private JdbcOperator jdbc;
	private OdataDataDao appDataDao;

	GetMetaData()
	{
		try
		{
			appDataDao= new OdataDataDao();
			propertiesMap= OdataUtility.getPropertiesMap();
			dataBase= propertiesMap.get("dataBase");
			jdbc= new JdbcOperator();
			metadata= null;

		}
		catch(NamingException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}

	}

	/**
	 * odataMetaData method used to get metadata of the database schema.
	 * 
	 * @return
	 *			  Return response metadata in EdmDataServices object.
	 */
	public EdmDataServices odataMetaData()
	{

		try
		{

			connection= appDataDao.getConnection();
			// build metadata. get all the table names, and each table's field
			List<EdmEntityType.Builder> entityTypes= new ArrayList<EdmEntityType.Builder>();
			List<EdmEntitySet.Builder> entitySets= new ArrayList<EdmEntitySet.Builder>();

			for(String tablename : jdbc.listTables(connection, dataBase))
			{
				List<EdmProperty.Builder> properties= jdbc.getColumnOdatas(connection, dataBase, tablename);

				// prepare index key
				List<String> keys= jdbc.getIndexColumn(connection, dataBase, tablename);
				
				EdmEntityType.Builder type= EdmEntityType.newBuilder().setNamespace(dataBase).addKeys(keys).addProperties(properties).setName(tablename);

				entityTypes.add(type);

				entitySets.add(EdmEntitySet.newBuilder().setName(tablename).setEntityType(type));
			}

			// assemble
			EdmEntityContainer.Builder container= EdmEntityContainer.newBuilder().setName(dataBase + " Entities").addEntitySets(entitySets).setIsDefault(true).setLazyLoadingEnabled(null);

			EdmSchema.Builder allSchema= EdmSchema.newBuilder().setNamespace(dataBase).addEntityTypes(entityTypes).addEntityContainers(container);

			metadata= EdmDataServices.newBuilder().setVersion(ODataConstants.DATA_SERVICE_VERSION).addSchemas(allSchema).build();

		}
		catch(NullPointerException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		catch(ClassNotFoundException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		catch(SQLException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
		}
		finally
		{
			OdataUtility.safeClose(connection);
		}
		return metadata;

	}

}
