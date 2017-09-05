package com.sap.pia.producer;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.sql.SQLIntegrityConstraintViolationException;
import javax.naming.NamingException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.sap.pia.producer.ccschema.CreateCCSchema;

/**
 * Servlet implementation class ViewCreationServlet
 */
public class ViewCreationServlet extends HttpServlet
{
	private static final long serialVersionUID= 1L;

	/**
	 * Static constant Logger object used for adding various logs .
	 */
	private static final Logger LOGGER= LoggerFactory.getLogger(ViewCreationServlet.class);

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public ViewCreationServlet()
	{
		super();
	}

	/**
	 * This method is Called by the client to get custom and common stories.
	 * 
	 * @param request
	 *            an HttpServletRequest object that contains the request the
	 *            client has made of the servlet
	 * @param response
	 *            an HttpServletResponse object that contains the response the
	 *            servlet sends to the client
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		int status= HttpServletResponse.SC_OK;
		GetStoryDetails getStoryDetails= null;
		getStoryDetails= new GetStoryDetails();
		String storyType= request.getParameter("storyType");
		String productName= null;
		String userName= null;
		OdataDataDao odataDataDao= null;
		Connection connection= null;

		try
		{

			if(storyType != null)
			{
				odataDataDao= new OdataDataDao();
				connection= odataDataDao.getConnection();

				OdataUtility.responseMessage= "";
				if(storyType.equalsIgnoreCase("formulaValidation"))
				{
					String formula= request.getParameter("formula");
					String colNames= request.getParameter("colNames");
					if(formula != null && colNames != null)
					{
						FormulaValidation formulaValidation= new FormulaValidation();
						status= formulaValidation.validateFormula(formula, colNames, connection);
						OdataUtility.writeToResponse(response);
						response.setStatus(status);
					}
					else
					{
						response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
					}
				}
				else
					if(storyType.equalsIgnoreCase("CommonStories"))
					{
						userName= request.getParameter("userName");
						if(userName != null)
						{
							status= getStoryDetails.getAllCommonStory(userName, connection);
							OdataUtility.writeToResponse(response);
							response.setStatus(status);
						}
						else
						{
							response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
						}
					}
					else
					{
						userName= request.getParameter("userName");
						productName= request.getParameter("productName");
						if(productName != null && userName != null)
						{
							status= getStoryDetails.getAllCustomStory(productName, userName, connection);
							OdataUtility.writeToResponse(response);
							response.setStatus(status);
						}
						else
						{
							response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
						}
					}
			}
			else
			{
				response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
			}

		}
		catch(SQLIntegrityConstraintViolationException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
			status= HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
		}
		catch(ClassNotFoundException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
			status= HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
		}
		catch(SQLException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
			status= HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
		}
		catch(NamingException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
			status= HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
		}
		finally
		{
			OdataUtility.safeClose(connection);
		}
	}

	/**
	 * This method will accept client request sent as HTTP Post.It will also
	 * call CreateCCSchema class to create views into the database.
	 * 
	 * @param request
	 *            an HttpServletRequest object that contains the request the
	 *            client has made of the servlet
	 * @param response
	 *            an HttpServletResponse object that contains the response the
	 *            servlet sends to the client
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException
	{
		int status= HttpServletResponse.SC_OK;
		CreateCCSchema views= null;
		String appID= request.getParameter("appID");
		String appType= request.getParameter("type");
		OdataDataDao odataDataDao= null;
		Connection connection= null;
		String statusMessage= "SUCCESS";
		String query= "";
		try
		{
			views= new CreateCCSchema(appID);
			odataDataDao= new OdataDataDao();
			connection= odataDataDao.getConnection();
			// Making a check if the Hierarchies are created
			if(appType.equalsIgnoreCase("custom"))
			{
				status= views.createViews();
			}
			else
			{
				status= views.createCommonViews();
			}

		}
		catch(NullPointerException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
			status= HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
		}
		catch(NamingException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
			status= HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
		}
		catch(ClassNotFoundException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
			status= HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
		}
		catch(SQLException e)
		{
			LOGGER.error(OdataUtility.getStackTrace(e));
			status= HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
		}
		finally
		{
			try
			{
				if(status != HttpServletResponse.SC_OK)
				{
					statusMessage= "FAILED";
				}
				query= "UPDATE SAP_PIA_USAGECLOUD.APPLICATION set IViewStatus = " + "'" + statusMessage + "'";
				LOGGER.debug("View status update query" + query);
				odataDataDao.runSQL(query, connection);
			}
			catch(SQLIntegrityConstraintViolationException e)
			{
				LOGGER.error(OdataUtility.getStackTrace(e));
				status= HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
			}
			catch(ClassNotFoundException e)
			{
				LOGGER.error(OdataUtility.getStackTrace(e));
				status= HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
			}
			catch(SQLException e)
			{
				LOGGER.error(OdataUtility.getStackTrace(e));
				status= HttpServletResponse.SC_INTERNAL_SERVER_ERROR;
			}
			finally
			{
				views.dispose();
				OdataUtility.safeClose(connection);
			}
		}
		response.setStatus(status);
	}

}
